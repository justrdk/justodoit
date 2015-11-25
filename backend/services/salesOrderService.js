'use strict';

module.exports = {
	assembleSalesOrder: function(db, ObjectId, salesOrders, cb) {
		var soICol = 'salesOrderItem';
		var productCol = 'product';

		var ids = salesOrders.map(function(so) {
			so.items = [];
			return new ObjectId(so._id);
		});

		var index = salesOrders.reduce(function(ans, next, idx) {
			ans[next._id] = idx;
			return ans;
		}, {});

		db.collection(soICol).find({
			salesOrderId: {
				$in: ids
			}
		}).toArray(function(err, docs) {
			var usedProductsIds = [];
			docs.forEach(function(soi) {
				if (usedProductsIds.indexOf(soi.productId) === -1) {
					usedProductsIds.push(new ObjectId(soi.productId));
				}
			});

			db.collection(productCol).find({
				_id: {
					$in: usedProductsIds
				}
			}).toArray(function(err, prods) {
				var prodIdx = prods.reduce(function(ans, prod) {
					ans[prod._id] = prod.name;
					return ans;
				}, {});

				docs.forEach(function(soi) {
					soi.name = prodIdx[soi.productId];
					delete soi.productId;
					salesOrders[index[soi.salesOrderId]].items.push(soi);
				});

				cb(salesOrders);
			});
		});
	},

	findByDate: function(request, cb) {
		var moment = require('moment');
		var soCol = 'salesOrder';
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var self = this;

		if (request.payload.hasOwnProperty('startDate') && request.payload.startDate) {
			var pStartDate = moment(request.payload.startDate, 'DD/MM/YYYY').toDate();
			var pEndDate;
			if (request.payload.hasOwnProperty('endDate') && request.payload.endDate) {
				pEndDate = moment(request.payload.endDate, 'DD/MM/YYYY').toDate();
				pEndDate.setHours(23, 59, 59);
			} else {
				pEndDate = new Date();
			}

			db.collection(soCol)
				.find({
					date: {
						$gte: pStartDate,
						$lte: pEndDate
					}
				}).toArray(function(err, docs) {

					self.assembleSalesOrder(db, ObjectId, docs, function(saleOrders) {
						cb({
							success: true,
							data: saleOrders
						});
					});
				});
		} else {
			cb({
				success: false,
				errorMessage: 'No se puede buscar ordenes de ventas sin una fecha inicial',
				params: request.params.startDate
			});
		}
	},

	getAllSalesOrders: function(request, cb) {
		var soCol = 'salesOrder';
		var db = request.server.plugins['hapi-mongodb'].db;

		db.collection(soCol)
			.find({})
			.toArray(function(err, docs) {
				cb({
					success: true,
					data: docs
				});
			});
	},

	getSalesOrder: function(request, cb) {
		var soCol = 'salesOrder';
		var soICol = 'salesOrderItem';
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var salesOrderId = request.params._id;

		db.collection(soCol).find({
			_id: new ObjectId(salesOrderId)
		}).toArray(function(err, docs) {
			if (docs.length) {
				db.collection(soICol).find({
					salesOrderId: new ObjectId(docs[0]._id)
				}, {
					'productId': true,
					'quantityToSell': true,
					'subtotal': true,
					'_id': false
				}).toArray(function(err, allItems) {
					docs[0].items = allItems;
					cb({
						success: true,
						data: docs[0]
					});
				});
			} else {
				cb({
					success: false,
					errorMessage: 'No existe la orden de venta que desea leer'
				});
			}
		});
	},

	createSalesOrder: function(request, cb) {
		var soCol = 'salesOrder';
		var soICol = 'salesOrderItem';
		var db = request.server.plugins['hapi-mongodb'].db;
		var ObjectId = request.server.plugins['hapi-mongodb'].ObjectID;
		var productCol = 'product';

		//1. Primero se crea un saleOrder
		var newSalesOrder = {
			date: new Date(),
			subtotal: 0,
			tax: 0,
			total: 0
		};
		db.collection(soCol).insert([newSalesOrder], function(err, result) {
			if (err) {
				cb({
					success: false,
					errorMessage: 'Hubo un error en la creación de la orden de venta',
					metadata: err
				});
			} else {
				var salesOrder = result.ops[0];

				//2. Se leen los datos de los productos usados
				var usedProductsIds = request.payload.items.reduce(function(ans, next) {
					if (ans.indexOf(next.productId) === -1) {
						ans.push(new ObjectId(next.productId));
					}

					return ans;
				}, []);

				db.collection(productCol).find({
					_id: {
						$in: usedProductsIds
					}
				}).toArray(function(err, usedProducts) {

					if (err) {
						cb({
							success: false,
							errorMessage: 'Hubo un error en la lectura de los productos usados',
							metadata: err
						});
					} else {
						var productMap = usedProducts.reduce(function(ans, next) {
							ans[next._id] = next;
							return ans;
						}, {});

						//3. Se crean los items de orden de venta
						var salesOrderSubtotal = 0;
						var newSalesOrderItems = request.payload.items.map(function(soItem) {
							var response = {
								salesOrderId: salesOrder._id,
								productId: soItem.productId,
								quantityToSell: soItem.quantityToSell,
								subtotal: productMap[soItem.productId].price * soItem.quantityToSell
							};
							salesOrderSubtotal += response.subtotal;
							return response;
						});

						db.collection(soICol).insert(newSalesOrderItems, function(err) {
							if (err) {
								cb({
									success: false,
									errorMessage: 'Hubo un error en la creación de los artículos de la orden de venta',
									metadata: err
								});
							} else {
								//4. Se actualizan los valores de subtotal, impuesto y total de la orden de venta
								salesOrder.subtotal = salesOrderSubtotal;
								salesOrder.tax = salesOrderSubtotal * 0.15;
								salesOrder.total = salesOrder.subtotal + salesOrder.tax;
								db.collection(soCol).save(salesOrder, function(err) {
									if (err) {
										cb({
											success: false,
											errorMessage: 'Hubo un error en la actualización de la orden de venta',
											metadata: err
										});
									} else {
										db.collection(soICol).find({
											salesOrderId: new ObjectId(salesOrder._id)
										}, {
											'productId': true,
											'quantityToSell': true,
											'subtotal': true,
											'_id': false
										}).toArray(function(err, allItems) {
											salesOrder.items = allItems;
											cb({
												success: true,
												data: salesOrder
											});
										});

									}
								});
							}
						});
					}
				});
			}
		});
	}
};
