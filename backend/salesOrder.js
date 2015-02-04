if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function(require) {
	var soCol = 'salesOrder';
	var soICol = 'salesOrderItem';
	var productCol = 'product'

	var salesOrder = {
		list: function(mongo, req, res) {
			mongo.db.collection(soCol)
				.find({})
				.toArray(function(err, docs) {
					res.json({
						success: true,
						data: docs
					});
				});
		},
		read: function(mongo, req, res) {
			var salesOrderId = req.params._id;

			mongo.db.collection(soCol).find({
				_id: mongo.objectId(salesOrderId)
			}).toArray(function(err, docs) {
				if (docs.length) {
					mongo.db.collection(soICol).find({
						salesOrderId: mongo.objectId(docs[0]._id)
					}, {
						"productId": true,
						"quantityToSell": true,
						"subtotal": true,
						"_id": false
					}).toArray(function(err, allItems) {
						docs[0].items = allItems;
						res.json({
							success: true,
							data: docs[0]
						});
					});
				} else {
					res.json({
						success: false,
						errorMessage: "No existe la orden de venta que desea leer"
					});
				}
			});
		},
		create: function(mongo, req, res) {
			//1. Primero se crea un saleOrder
			var newSalesOrder = {
				date: new Date(),
				subtotal: 0,
				tax: 0,
				total: 0
			};
			mongo.db.collection(soCol).insert([newSalesOrder],  function(err, result) {
				if (err) {
					res.json({
						success: false,
						errorMessage: "Hubo un error en la creación de la orden de venta",
						metadata: err
					});
				} else {
					var salesOrder = result.ops[0]
					//2. Se leen los datos de los productos usados
					var usedProductsIds = req.body.items.reduce(function(ans, next) {
						if (ans.indexOf(next.productId) === -1) {
							ans.push(mongo.objectId(next.productId))
						}
						return ans;
					}, []);

					mongo.db.collection(productCol).find({
						_id: {
							$in: usedProductsIds
						}
					}).toArray(function(err, usedProducts) {

						if (err) {
							res.json({
								success: false,
								errorMessage: "Hubo un error en la lectura de los productos usados",
								metadata: err
							});
						} else {
							var productMap = usedProducts.reduce(function(ans, next) {
								ans[next._id] = next;
								return ans;
							}, {});

							//3. Se crean los items de orden de venta
							var salesOrderSubtotal = 0;
							var newSalesOrderItems = req.body.items.map(function(soItem) {
								var response = {
									salesOrderId: salesOrder._id,
									productId: soItem.productId,
									quantityToSell: soItem.quantityToSell,
									subtotal: productMap[soItem.productId].price * soItem.quantityToSell
								};
								salesOrderSubtotal += response.subtotal;
								return response;
							})
							mongo.db.collection(soICol).insert(newSalesOrderItems, function(err, salesOrderItems) {
								if (err) {
									res.json({
										success: false,
										errorMessage: "Hubo un error en la creación de los artículos de la orden de venta",
										metadata: err
									});
								} else {
									//4. Se actualizan los valores de subtotal, impuesto y total de la orden de venta
									salesOrder.subtotal = salesOrderSubtotal;
									salesOrder.tax = salesOrderSubtotal * 0.15;
									salesOrder.total = salesOrder.subtotal + salesOrder.tax;
									mongo.db.collection(soCol).save(salesOrder, function(err) {
										if (err) {
											res.json({
												success: false,
												errorMessage: "Hubo un error en la actualización de la orden de venta",
												metadata: err
											});
										} else {
											mongo.db.collection(soICol).find({
												salesOrderId: mongo.objectId(salesOrder._id)
											}, {
												"productId": true,
												"quantityToSell": true,
												"subtotal": true,
												"_id": false
											}).toArray(function(err, allItems) {
												salesOrder.items = allItems;
												res.json({
													success: true,
													data: salesOrder
												});
											})


										}
									})
								}
							})

						}
					})
				}
			});
		},
	}
	return salesOrder;
});