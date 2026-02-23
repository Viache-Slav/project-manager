import PublicDesignItemCard from './designItemCard/PublicDesignItemCard';

const PublicDesignItemsGrid = ({
  items,
  selectedFabrics,
  fabricColors,
  onSelectFabric,
  onSelectColor,
  onAddToOrder,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <PublicDesignItemCard
          key={item._id}
          item={item}
          selected={selectedFabrics[item._id]}
          colors={fabricColors[item._id]}
          onSelectFabric={onSelectFabric}
          onSelectColor={onSelectColor}
          onAddToOrder={onAddToOrder}
        />
      ))}
    </div>
  );
};

export default PublicDesignItemsGrid;