import Footer from "@/components/footer";
import FoundItemsContent from "./_found-items-components/found-items-content";
import FoundItemsHeader from "./_found-items-components/found-items-header";

const FoundItems = async () => {
  return (
    <>
      <div className="grid grid-rows-[1fr_auto] h-full">
        <div className="grid grid-rows-[auto_1fr] h-full">
          <FoundItemsHeader />
          <FoundItemsContent />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default FoundItems;
