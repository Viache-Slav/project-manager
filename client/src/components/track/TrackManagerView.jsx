// import React from 'react';
// import styles from './TrackManager.module.css';


// const TrackManagerView = ({
//   styles,
//   routes,
//   showForm,
//   orders,
//   products,
//   quantities,
//   departureTime,
//   selectedFabrics,
//   fabricColors,
//   fabricMeta,
//   trackItems,
//   setDepartureTime,
//   setShowForm,
//   handleCreateClick,
//   handleSubmit,
//   handleSelectBrand,
//   handleSelectCollection,
//   handleSelectColor,
//   resetFabricSelection,
//   handleQuantityChange,
//   isOrderAddedToTrack,
//   addOrderToTrack,
// }) => {
//   return (
//     <div className={styles['track-manager']}>
//       <h2 className={styles['track-manager__heading']}>Track Planner</h2>

//       <button className={styles['track-manager__button']} onClick={handleCreateClick}>
//         Create a Track
//       </button>

//       {showForm && (
//         <div className={styles['modal-overlay']}>
//           <div className={styles['modal-content']}>
//             <form onSubmit={handleSubmit}>
//               <label className={styles['track-manager__label']}>
//                 Dispatch time:
//                 <input
//                   type="datetime-local"
//                   value={departureTime}
//                   onChange={(e) => setDepartureTime(e.target.value)}
//                   required
//                   className={styles['track-manager__input']}
//                 />
//               </label>

//               {orders.length > 0 && (
//                 <>
//                   <h3>Ordered items (from orders):</h3>

//                   <div className={styles.ordered}>
//                     {orders
//                       .filter((order) => !isOrderAddedToTrack(order._id))
//                       .map((order) => (
//                         <div key={order._id} className={styles.orderBlock}>
//                           <div className={styles.orderHeader}>
//                             <strong>Order #{order._id.slice(-6)}</strong>
//                             {order.customer?.name && <span>{order.customer.name}</span>}
//                           </div>

//                           {order.items.map((item) => (
//                             <div key={item.designItem} className={styles.orderedItem}>
//                               <div>
//                                 {item.title} — Qty: {item.quantity}
//                               </div>

//                               {item.fabric && (
//                                 <div className={styles.orderedFabric}>
//                                   {item.fabric.brand} / {item.fabric.collection} / {item.fabric.color}
//                                 </div>
//                               )}
//                             </div>
//                           ))}

//                           <button
//                             type="button"
//                             className={styles.addBtn}
//                             onClick={() => addOrderToTrack(order)}
//                           >
//                             + Add whole order
//                           </button>
//                         </div>
//                       ))}
//                   </div>
//                 </>
//               )}

//               <h3>Products:</h3>
//               <div className={styles['products-grid']}>
//                 {products.map((product) => (
//                   <div key={product._id} className={styles.productRow}>
//                     <div className={styles.productTitle}>{product.title}</div>

//                     <div className={styles.fabricPicker}>
//                       {!selectedFabrics[product._id] && (
//                         <select
//                           className={styles.select}
//                           onChange={(e) => handleSelectBrand(product._id, e.target.value)}
//                           defaultValue=""
//                         >
//                           <option value="">Brand</option>
//                           {[...new Set(fabricMeta.map((f) => f.brand))].map((brand) => (
//                             <option key={brand} value={brand}>
//                               {brand}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {selectedFabrics[product._id]?.step === 'collection' && (
//                         <select
//                           className={styles.select}
//                           onChange={(e) => handleSelectCollection(product._id, e.target.value)}
//                           defaultValue=""
//                         >
//                           <option value="">Collection</option>
//                           {fabricMeta
//                             .find((f) => f.brand === selectedFabrics[product._id].brand)
//                             ?.collections.map((c) => (
//                               <option key={c.name} value={c.name}>
//                                 {c.name}
//                               </option>
//                             ))}
//                         </select>
//                       )}

//                       {selectedFabrics[product._id]?.step === 'color' && (
//                         <select
//                           className={styles.select}
//                           onChange={(e) => handleSelectColor(product._id, e.target.value)}
//                           defaultValue=""
//                         >
//                           <option value="">Color</option>
//                           {fabricColors[product._id]?.map((c) => (
//                             <option key={c._id} value={c.colorName}>
//                               {c.colorName}
//                             </option>
//                           ))}
//                         </select>
//                       )}

//                       {selectedFabrics[product._id]?.step === 'done' && (
//                         <div
//                           className={styles.fabricSelected}
//                           onClick={() => resetFabricSelection(product._id)}
//                           title="Click to change"
//                         >
//                           {selectedFabrics[product._id].brand} /{selectedFabrics[product._id].collection} /
//                           {selectedFabrics[product._id].color}
//                         </div>
//                       )}
//                     </div>

//                     <input
//                       type="number"
//                       min="0"
//                       value={quantities[product._id] || ''}
//                       onChange={(e) => handleQuantityChange(product._id, e.target.value)}
//                       className={styles.qtyInput}
//                     />
//                   </div>
//                 ))}
//               </div>

//               <h3>Track items:</h3>

//               <div className={styles.trackPreview}>
//                 {Object.entries(trackItems).map(([key, item]) => (
//                   <div key={key} className={styles.trackItem}>
//                     <div>
//                       <strong>{item.title}</strong>
//                       {item.source === 'order' && ' (order)'}
//                     </div>

//                     <div>Qty: {item.quantity}</div>

//                     {item.fabric && (
//                       <div className={styles.fabricPreview}>
//                         {item.fabric.brand} / {item.fabric.collection} / {item.fabric.color}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <button className={styles['track-manager__button']} type="submit">
//                 Save the Track
//               </button>
//               <button
//                 type="button"
//                 className={styles['track-manager__button']}
//                 onClick={() => setShowForm(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       <h3>Existing Tracks:</h3>
//       <ul className={styles['track-manager__list']}>
//         {routes.map((route) => (
//           <li className={styles['track-manager__item']} key={route._id}>
//             <strong>
//               {new Date(route.departureTime).toLocaleString('en-US', {
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </strong>{' '}
//             — items: {route.items.reduce((sum, item) => sum + item.quantity, 0)}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TrackManagerView;
import React from 'react';
import styles from './TrackManager.module.css';

const TrackManagerView = ({
  routes,
  showForm,
  orders,
  products,
  quantities,
  departureTime,
  selectedFabrics,
  fabricColors,
  fabricMeta,
  trackItems,
  setDepartureTime,
  setShowForm,
  handleCreateClick,
  handleSubmit,
  handleSelectBrand,
  handleSelectCollection,
  handleSelectColor,
  resetFabricSelection,
  handleQuantityChange,
  isOrderAddedToTrack,
  addOrderToTrack,
}) => {
  return (
    <div className={styles.trackManager}>
      <h2 className={styles.trackManagerHeading}>Track Planner</h2>

      <button className={styles.trackManagerButton} onClick={handleCreateClick}>
        Create a Track
      </button>

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit}>
              <label className={styles.trackManagerLabel}>
                Dispatch time:
                <input
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  required
                  className={styles.trackManagerInput}
                />
              </label>

              {orders.length > 0 && (
                <>
                  <h3>Ordered items (from orders):</h3>

                  <div className={styles.ordered}>
                    {orders
                      .filter((order) => !isOrderAddedToTrack(order._id))
                      .map((order) => (
                        <div key={order._id} className={styles.orderBlock}>
                          <div className={styles.orderHeader}>
                            <strong>Order #{order._id.slice(-6)}</strong>
                            {order.customer?.name && <span>{order.customer.name}</span>}
                          </div>

                          {order.items.map((item) => (
                            <div key={item.designItem} className={styles.orderedItem}>
                              <div>
                                {item.title} — Qty: {item.quantity}
                              </div>

                              {item.fabric && (
                                <div className={styles.orderedFabric}>
                                  {item.fabric.brand} / {item.fabric.collection} / {item.fabric.color}
                                </div>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className={styles.addBtn}
                            onClick={() => addOrderToTrack(order)}
                          >
                            +
                          </button>
                        </div>
                      ))}
                  </div>
                </>
              )}

              <h3>Products:</h3>
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <div key={product._id} className={styles.productRow}>
                    <div className={styles.productTitle}>{product.title}</div>

                    <div className={styles.fabricPicker}>
                      {!selectedFabrics[product._id] && (
                        <select
                          className={styles.select}
                          onChange={(e) => handleSelectBrand(product._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Brand</option>
                          {[...new Set(fabricMeta.map((f) => f.brand))].map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      )}

                      {selectedFabrics[product._id]?.step === 'collection' && (
                        <select
                          className={styles.select}
                          onChange={(e) => handleSelectCollection(product._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Collection</option>
                          {fabricMeta
                            .find((f) => f.brand === selectedFabrics[product._id].brand)
                            ?.collections.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      )}

                      {selectedFabrics[product._id]?.step === 'color' && (
                        <select
                          className={styles.select}
                          onChange={(e) => handleSelectColor(product._id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Color</option>
                          {fabricColors[product._id]?.map((c) => (
                            <option key={c._id} value={c.colorName}>
                              {c.colorName}
                            </option>
                          ))}
                        </select>
                      )}

                      {selectedFabrics[product._id]?.step === 'done' && (
                        <div
                          className={styles.fabricSelected}
                          onClick={() => resetFabricSelection(product._id)}
                          title="Click to change"
                        >
                          {selectedFabrics[product._id].brand} / {selectedFabrics[product._id].collection} /
                          {selectedFabrics[product._id].color}
                        </div>
                      )}
                    </div>

                    <input
                      type="number"
                      min="0"
                      value={quantities[product._id] || ''}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      className={styles.qtyInput}
                    />
                  </div>
                ))}
              </div>

              <h3>Track items:</h3>

              <div className={styles.trackPreview}>
                {Object.entries(trackItems).map(([key, item]) => (
                  <div key={key} className={styles.trackItem}>
                    <div>
                      <strong>{item.title}</strong>
                      {item.source === 'order' && ' (order)'}
                    </div>

                    <div>Qty: {item.quantity}</div>

                    {item.fabric && (
                      <div className={styles.fabricPreview}>
                        {item.fabric.brand} / {item.fabric.collection} / {item.fabric.color}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button className={styles.trackManagerButton} type="submit">
                Save the Track
              </button>
              <button
                type="button"
                className={styles.trackManagerButton}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <h3>Existing Tracks:</h3>
      <ul className={styles.trackManagerList}>
        {routes.map((route) => (
          <li className={styles.trackManagerItem} key={route._id}>
            <strong>
              {new Date(route.departureTime).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </strong>{' '}
            — items: {route.items.reduce((sum, item) => sum + item.quantity, 0)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackManagerView;
