export class Options {
  backgroundColor? = "";
  textColor? = "";
  isCloseButton? = false;
  closeIconColor? = "";
  closeIconBackgroundColor? = "";
  duration? = 5000;
  left? = "auto";
  right? = "40px";
  top? = "40px";
  bottom? = "auto";

  constructor(obj?: Partial<Options>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
