import ClientRegisterForm from '../public/ClientRegisterForm';
import Modal from '../ui/Modal';
import PublicDesignItemsGrid from './PublicDesignItemsGrid';
import PublicCart from './PublicCart';

const PublicDesignItemsView = (props) => {
  const {
    items,
    orderItems,
    showAuthModal,
    onCloseAuth,
  } = props;

  return (
    <div className="grid gap-4">
      <PublicDesignItemsGrid {...props} />

      {orderItems.length > 0 && <PublicCart {...props} />}

      <Modal open={showAuthModal} onClose={onCloseAuth}>
        <ClientRegisterForm onSuccess={onCloseAuth} />
      </Modal>
    </div>
  );
};

export default PublicDesignItemsView;