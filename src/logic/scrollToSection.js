export const scrollToSection = (e, offset, sectionId) => {
  e.preventDefault();
  const section = document.getElementById(sectionId);
  const sectionPosition = section.offsetTop;
  window.scrollTo({
    top: sectionPosition - offset,
  });
};
