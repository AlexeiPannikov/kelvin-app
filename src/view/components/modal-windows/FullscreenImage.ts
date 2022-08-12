export class FullscreenImage {
    private img: HTMLImageElement = null;
    private imgWrap: HTMLDivElement = null;
    private imgs: HTMLImageElement[] = [];
    private imgsWrap: HTMLDivElement = null;
    currentImgIdx: number = 0;
    private width: number = null;
    private height: number = null;
    private isMovementAllowed: boolean = false;
    private isStartFlipping: boolean = false;
    private shiftX = 0;
    private shiftY = 0;
    private startPointY = 0;
    private startPointY2 = 0;
    private startPointX = 0;
    private startPointX2 = 0;
    private startWidth = 0;
    private startHeight = 0;
    isStopResize = false

    get imgWidth() {
        return this.width;
    }

    get imgHeight() {
        return this.height;
    }

    set imgWidth(w: number) {
        this.width = w;
    }

    set imgHeight(h: number) {
        this.height = h;
    }

    private get isMoreScreen() {
        const isMoreScreen =
            this.imgHeight > window.innerHeight || this.imgWidth > window.innerWidth;
        if (isMoreScreen) this.img.style.cursor = "move";
        else this.img.style.cursor = "default";
        return isMoreScreen;
    }

    get hasNotStartWidth() {
        if (!this.imgWidth) return
        return this.imgWidth > this.img.naturalWidth
    }

    init(imgs: HTMLImageElement[], idx = 0) {
        this.currentImgIdx = idx
        this.imgs = imgs;
        this.imgsWrap = this.imgs[idx].parentElement.parentElement as HTMLDivElement;
        this.setSlidePosition()
        this.imgWidth = this.img.naturalWidth;
        this.imgHeight = this.img.naturalHeight;
        this.startWidth = this.img.naturalWidth;
        this.startHeight = this.img.naturalHeight;
        this.subscribeOnWheel();
        this.subscribeOnMousedownOnWrap()
        this.imgsWrap.style.transition = "all 0.3s linear"
    }

    private subscribeOnWheel() {
        window.addEventListener("wheel", this.setWidth.bind(this));
        document.addEventListener("touchmove", this.setWidth.bind(this));
    }

    private subscribeOnMousedownOnWrap() {
        this.imgsWrap.addEventListener("mousedown", this.startFlipping.bind(this))
    }

    private setSlidePosition() {
        this.img = this.imgs[this.currentImgIdx];
        this.imgsWrap.style.left = "0px"
        this.imgWrap = this.img.parentElement as HTMLDivElement;
        this.imgsWrap.style.left = -window.innerWidth * this.currentImgIdx + "px"
        if (this.currentImgIdx === 0) {
            this.imgsWrap.style.left = "0px"
        }
    }

    flipForward() {
        if (this.currentImgIdx + 1 < this.imgs.length && !this.hasNotStartWidth) {
            this.currentImgIdx += 1
            this.setSlidePosition()
        }
    }

    flipBack() {
        if (this.currentImgIdx > 0 && !this.hasNotStartWidth) {
            this.currentImgIdx -= 1
            this.setSlidePosition()
        }
    }

    private startFlipping(e: MouseEvent | TouchEvent) {
        if (this.hasNotStartWidth) return;
        if (this.imgs.length < 2) return
        const foundImg = ((e.target as HTMLElement).getElementsByTagName("img")[0] || e.target) as HTMLImageElement
        this.currentImgIdx = this.imgs.indexOf(foundImg)
        this.isStartFlipping = true
        if (e instanceof MouseEvent) {
            e.preventDefault();
            this.startPointX = e.clientX;
            this.shiftX = e.clientX - this.imgsWrap.getBoundingClientRect().left;
        }
        if (e instanceof TouchEvent) {
            this.startPointX = e.changedTouches[0].clientX;
            this.shiftX = e.changedTouches[0].clientX - this.imgsWrap.getBoundingClientRect().left;
        }
        this.imgsWrap.addEventListener("mousemove", this.flipping.bind(this))
        document.addEventListener("mouseup", this.stopFlipping.bind(this))
    }

    private flipping(e: MouseEvent | TouchEvent) {
        if (!this.isStartFlipping) return
        this.imgsWrap.style.position = "relative";
        if (e instanceof MouseEvent) {
            e.preventDefault();
            this.imgsWrap.style.left = e.pageX - this.shiftX + "px";
        }
        if (e instanceof TouchEvent) {
            this.imgsWrap.style.left = e.changedTouches[0].clientX - this.shiftX + "px";
        }
    }

    private stopFlipping(e: MouseEvent | TouchEvent) {
        this.isStartFlipping = false
        if (e instanceof MouseEvent) {
            if (this.startPointX - e.clientX > 50 && this.currentImgIdx + 1 < this.imgs.length) {
                this.currentImgIdx += 1
            }
            if (e.clientX - this.startPointX > 50 && this.currentImgIdx > 0) {
                this.currentImgIdx -= 1
            }
        }
        this.setSlidePosition()
    }

    private setWidth(e: WheelEvent | TouchEvent) {
        if (this.isStopResize) return;
        if (e instanceof WheelEvent) {
            if (e.deltaY < 0) {
                this.imgWidth = this.imgWidth + (this.imgWidth / 100) * 10;
                this.imgHeight = this.imgHeight + (this.imgHeight / 100) * 10;
            }
            if (
                e.deltaY > 0 &&
                this.imgWidth > this.startWidth &&
                this.imgHeight > this.startHeight
            ) {
                this.imgWidth = this.imgWidth - (this.imgWidth / 100) * 10;
                this.imgHeight = this.imgHeight - (this.imgHeight / 100) * 10;
            }
            if (
                e.deltaY > 0 &&
                (this.imgWidth < this.startWidth || this.imgHeight < this.startHeight)
            ) {
                this.imgWidth = this.startWidth;
                this.imgHeight = this.startHeight;
            }
        }
        if (e instanceof TouchEvent) {
            if (e.changedTouches.length < 2) return;
            if (e.changedTouches[1].clientY > this.startPointY2) {
                this.imgWidth = this.imgWidth + 10;
                this.imgHeight = this.imgHeight + 10;
            }
            if (e.changedTouches[1].clientX > this.startPointX2) {
                this.imgWidth = this.imgWidth + 10;
                this.imgHeight = this.imgHeight + 10;
            }
            if (e.changedTouches[1].clientY < this.startPointY2) {
                this.imgWidth = this.imgWidth - 10;
                this.imgHeight = this.imgHeight - 10;
            }
            if (e.changedTouches[1].clientX < this.startPointX2) {
                this.imgWidth = this.imgWidth - 10;
                this.imgHeight = this.imgHeight - 10;
            }
        }
        this.img.style.width = this.imgWidth + "px";
        this.img.style.height = this.imgHeight + "px";
        if (this.isMoreScreen) this.subscribeOnMove();
        else {
            this.unsubscribeOnMove();
            this.img.style.position = "static";
            this.img.style.left = "auto";
            this.img.style.right = "auto";
        }
    }

    private subscribeOnMove() {
        document.addEventListener("mousedown", this.startMove.bind(this));
        document.addEventListener("touchstart", this.startMove.bind(this));
        document.addEventListener("mousemove", this.move.bind(this));
        document.addEventListener("touchmove", this.move.bind(this));
        document.addEventListener("mouseup", this.endMove.bind(this));
        document.addEventListener("touchend", this.endMove.bind(this));
    }

    private unsubscribeOnMove() {
        document.removeEventListener("mousedown", this.startMove.bind(this));
        document.removeEventListener("touchstart", this.startMove.bind(this));
        document.removeEventListener("mousemove", this.move.bind(this));
        document.removeEventListener("touchmove", this.move.bind(this));
        document.removeEventListener("mouseup", this.endMove.bind(this));
        document.removeEventListener("touchend", this.endMove.bind(this));
    }

    private startMove(e: MouseEvent | TouchEvent) {
        if (!this.isMoreScreen) return;
        this.isMovementAllowed = true;
        if (e instanceof MouseEvent) {
            e.preventDefault();
            this.startPointY = e.clientY;
            this.startPointX = e.clientX;
            this.shiftX = e.clientX - this.img.getBoundingClientRect().left;
            this.shiftY = e.clientY - this.img.getBoundingClientRect().top;
        }
        if (e instanceof TouchEvent) {
            this.startPointY = e.changedTouches[0].clientY;
            this.startPointY2 = e.changedTouches[1]?.clientY;
            this.startPointX = e.changedTouches[0].clientX;
            this.startPointX2 = e.changedTouches[1]?.clientX;
            this.shiftX =
                e.changedTouches[0].clientX - this.img.getBoundingClientRect().left;
            this.shiftY =
                e.changedTouches[0].clientY - this.img.getBoundingClientRect().top;
        }
    }

    private move(e: MouseEvent | TouchEvent) {
        if (this.isMovementAllowed) {
            this.img.style.position = "fixed";
            if (e instanceof MouseEvent) {
                e.preventDefault();
                this.img.style.left = e.pageX - this.shiftX + "px";
                this.img.style.top = e.pageY - this.shiftY + "px";
            }
            if (e instanceof TouchEvent) {
                this.img.style.left = e.changedTouches[0].clientX - this.shiftX + "px";
                this.img.style.top = e.changedTouches[0].clientY - this.shiftY + "px";
            }
        }
    }

    private endMove(e: MouseEvent | TouchEvent) {
        this.isMovementAllowed = false;
        if (!this.isMoreScreen) return;
        this.img.style.transition = "inset 0.3s linear";
        if (e instanceof MouseEvent) {
            if (
                this.img.getBoundingClientRect().top > 0 &&
                e.clientY > this.startPointY
            ) {
                this.img.style.top = 0 + "px";
                this.img.style.bottom = "auto";
            }
            if (
                this.img.getBoundingClientRect().bottom < window.innerHeight &&
                e.clientY < this.startPointY
            ) {
                this.img.style.bottom = 0 + "px";
                this.img.style.top = "auto";
            }
            if (
                this.img.getBoundingClientRect().left < 0 &&
                e.clientX < this.startPointX
            ) {
                this.img.style.left = 0 + "px";
                this.img.style.right = "auto";
            }
            if (
                this.img.getBoundingClientRect().right > window.innerWidth &&
                e.clientX > this.startPointX
            ) {
                this.img.style.right = 0 + "px";
                this.img.style.left = "auto";
            }
        }
        if (e instanceof TouchEvent) {
            if (
                this.img.getBoundingClientRect().top > 0 &&
                e.changedTouches[0].clientY > this.startPointY
            ) {
                this.img.style.top = 0 + "px";
                this.img.style.bottom = "auto";
            }
            if (
                this.img.getBoundingClientRect().bottom < window.innerHeight &&
                e.changedTouches[0].clientY < this.startPointY
            ) {
                this.img.style.bottom = 0 + "px";
                this.img.style.top = "auto";
            }
            if (
                this.img.getBoundingClientRect().left < 0 &&
                e.changedTouches[0].clientX < this.startPointX
            ) {
                this.img.style.left = 0 + "px";
                this.img.style.right = "auto";
            }
            if (
                this.img.getBoundingClientRect().right > window.innerWidth &&
                e.changedTouches[0].clientX > this.startPointX
            ) {
                this.img.style.right = 0 + "px";
                this.img.style.left = "auto";
            }
        }
        setTimeout(() => (this.img.style.transition = "none"), 300);
    }

    unsubscribe() {
        window.removeEventListener("wheel", this.setWidth.bind(this));
        document.removeEventListener("touchmove", this.setWidth.bind(this));
        this.unsubscribeOnMove();
    }

    constructor(imgs?: HTMLImageElement[]) {
        if (imgs) {
            this.init(imgs);
        }
    }
}
