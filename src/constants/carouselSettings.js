export const CustomLeftArrow = ({ onClick, disabled }) => (
  <div
    className={`image-gallery-icon image-gallery-left-nav ${
      disabled ? "disabled" : ""
    }`}
    onClick={onClick}
  >
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M15.41,7.41L14,6l-6,6 6,6 1.41,-1.41L10.83,12L15.41,7.41Z" />
    </svg>
  </div>
);

export const CustomRightArrow = ({ onClick, disabled }) => (
  <div
    className={`image-gallery-icon image-gallery-right-nav ${
      disabled ? "disabled" : ""
    }`}
    onClick={onClick}
  >
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M8.59,16.59L10,18l6,-6 -6,-6 -1.41,1.41L13.17,12L8.59,16.59Z" />
    </svg>
  </div>
);

export const otherCarouselSettings = {
  infinite: false,
  slidesToShow: 3,
  slidesToScroll: 1,
  prevArrow: <CustomLeftArrow />,
  nextArrow: <CustomRightArrow />,
  responsive: [
    {
      breakpoint: 989,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
