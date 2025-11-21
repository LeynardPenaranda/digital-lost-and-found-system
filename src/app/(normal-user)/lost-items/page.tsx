import LostItemsHeader from "./_lost-items-components/lost-items-header";
import LostItemsContent from "./_lost-items-components/lost-items-content";
import Footer from "@/components/footer";

const LostItems = () => {
  return (
    <>
      <div className="grid grid-rows-[1fr_auto] h-full">
        <div className="grid grid-rows-[auto_1fr] h-full">
          <LostItemsHeader />
          <LostItemsContent />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LostItems;
