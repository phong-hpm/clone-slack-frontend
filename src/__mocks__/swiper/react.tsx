import { FC } from "react";

const SwiperSlide: FC = ({ children }) => {
  return <div data-testid="SwiperSlide">{children}</div>;
};

const Swiper: FC<{ hidden: boolean; pagination?: { renderBullet?: Function } }> = ({
  hidden,
  pagination,
  children,
}) => {
  if (hidden) return <></>;

  return (
    <div data-testid="Swiper">
      <div>{children}</div>
      <div data-testid="renderBullet">{pagination?.renderBullet?.()}</div>
    </div>
  );
};

module.exports = { Swiper, SwiperSlide };

export {};
