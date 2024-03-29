import CategoryHeader from "@/components/header/category-header/CategoryHeader";

export default function CategoryPagesLayout({ children }) {
  return (
    <>
      <header>
        <CategoryHeader isCategory={true} />
      </header>
      {children}
    </>
  );
}
