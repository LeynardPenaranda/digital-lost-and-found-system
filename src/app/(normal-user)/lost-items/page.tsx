import LostItemsHeader from "./_lost-items-components/lost-items-header";
import LostItemsContent from "./_lost-items-components/lost-items-content";

const LostItems = () => {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full">
      <LostItemsHeader />
      <LostItemsContent />
    </div>
  );
};

export default LostItems;
