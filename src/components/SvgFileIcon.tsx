import { useState, useEffect, FC, SVGProps } from "react";
import icons from "assets/icons";

export interface SvgFileIconProps extends SVGProps<SVGSVGElement> {
  icon: keyof typeof icons;
}

const SvgFileIcon: FC<SvgFileIconProps> = ({ icon, ...props }) => {
  const [instance, setInstace] = useState<{ ReactComponent: FC<SVGProps<SVGSVGElement>> }>();

  useEffect(() => {
    if (!icon) return;

    try {
      if (icons[icon].ReactComponent) {
        setInstace(icons[icon]);
      }
    } catch {
      console.error(`icons ${icon} didn't exist`);
    }
  }, [icon]);

  if (!instance) return <></>;

  return <instance.ReactComponent {...props} />;
};

export default SvgFileIcon;
