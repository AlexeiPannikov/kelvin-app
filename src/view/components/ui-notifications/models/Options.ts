export class Options {
  backgroundColor? = "";
  textColor? = "";
  isCloseButton? = false;
  closeIconColor? = "";
  closeIconBackgroundColor? = "";
  duration? = 5000;
  left? = "40px";
  right? = "auto";
  top? = "auto";
  bottom? = "0";

  constructor(obj?: Partial<Options>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
