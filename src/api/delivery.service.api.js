const { request, response } = require("express");
const DeliveryService = require("../models/delivery.service.model");

/**
 * @todo create @function GetById,MasterData,DeliveryServiceListIncudingFilters
 */

/**
 * Delivery Service Service
 * @param {DeliveryServiceDTO}
 * @service save and update Delivery Service
 * @returns {Promise<responseDTO>}
 */
const saveDeliveryService = async (request, response) => {
	try {
		let { id, name, email, telephoneNumber, address } = request.body;
		if (id === null) {
			let deliveryService = new DeliveryService({
				name,
				email,
				telephoneNumber,
				address,
				createdOn: new Date(),
				updatedOn: new Date(),
			});

			await deliveryService.save();

			response.json({
				isSuccess: true,
				message: "Delivery Service has been save successfully",
			});
		} else {
			const availableDeliveryService = await DeliveryService.findById(id);

			if (availableDeliveryService === null) {
				response.json({
					isSuccess: false,
					message: "Not Found Delivery Service Please try Again",
				});
			}

			const deliveryServiceObj = await DeliveryService.findByIdAndUpdate(id, {
				name,
				email,
				telephoneNumber,
				address,
				updatedOn: new Date.now(),
			});

			response.json({
				isSuccess: true,
				message: "Delivery Service has been updated successfully",
			});
		}
	} catch (error) {
		response.json({
			isSuccess: false,
			message: "Error has been occred please try again " + error,
		});
	}
};

/**
 * Delivery Service Service
 * @param {DeliveryServiceId}
 * @service Delete Delivery Service
 * @returns {Promise<responseDTO>}
 */

const deleteDeliveryService = async (request, response) => {
	try {
		const deleveryServiceId = request.params.id;

		let deliveryService = await DeliveryService.findById(deleveryServiceId);

		if (deliveryService === null) {
			response.json({
				isSuccess: false,
				message: "Not Found Delivery Service Please try Again",
			});
		}

		deliveryService = await DeliveryService.findByIdAndDelete(deleveryServiceId);

		response.json({
			isSuccess: true,
			message: "Delivery Service has been delete successfully",
		});
	} catch (error) {
		response.json({
			isSuccess: false,
			message: "Error has been occred please try again",
		});
	}
};

/**
 * Delivery Service Service
 * @param {DeliveryServiceFilterDTO}
 * @service Get All Search Delivery Services
 * @returns {Promise<Array<DeliveryService>>}
 */

const getAllDeliveryServices = async (request, response) => {
	try {
		let { searchText } = request.body;

		if (searchText != null) {
			let deliveryServicesDataSet = await DeliveryService.find({ name: { $regex: searchText, $options: "i" } });

			response.json(deliveryServicesDataSet);
		} else {
			let deliveryServicesDataSet = await DeliveryService.find().exec();
			response.json(deliveryServicesDataSet);
		}
	} catch (error) {}
};

/**
 * Delivery Service Service
 * @param {DisabledDeliveyServiceDTO}
 * @service Disable Delivery Service Activities
 * @returns {Promise<responseDTO>}
 */

const controlDeliveryServiceActivities = async (request, response) => {
	try {
		const { id, isActive } = request.body;

		let deliveryService = await DeliveryService.findById(id);

		if (!deliveryService) {
			response.json({
				isSuccess: false,
				message: "Not Found Delivery Service Please try Again",
			});
		} else {
			deliveryService = await DeliveryService.findByIdAndUpdate(id, {
				$set: {
					isActive: isActive,
				},
			});

			if (isActive === true) {
				response.json({
					isSuccess: true,
					message: "Delivery Service has been enabled successfully",
				});
			} else {
				response.json({
					isSuccess: true,
					message: "Delivery Service has been disabled successfully",
				});
			}
		}
	} catch (error) {
		response.json({
			isSuccess: false,
			message: "Error has been occred please try again",
		});
	}
};

/**
 * Delivery Service Service
 * @param {DeliveryServiceId}
 * @service Get Master Delivery Service Data
 * @returns {Promise<DeliveryServiceDTO>}
 */
const deliveryServiceGetById = async (request, response) => {
	try {
		const deliveryServiceId = request.params.id;

		const deliveryService = await DeliveryService.findById(deliveryServiceId);

		response.json(deliveryService);
	} catch (error) {}
};

/**
 * Delivery Service Service
 * @param {}
 * @service Get Master Delivery Service Data
 * @returns {Promise<dropDownDTO>}
 */
const getDeliveryServiceMasterData = async (request, response) => {
	try {
		let dropDownDTO = [];

		const masterData = await DeliveryService.find({ isActive: true });

		for (const item in masterData) {
			dropDownDTO.push({
				id: masterData[item]._id,
				name: masterData[item].name,
			});
		}

		response.json(dropDownDTO);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	saveDeliveryService,
	deleteDeliveryService,
	getAllDeliveryServices,
	controlDeliveryServiceActivities,
	getDeliveryServiceMasterData,
	deliveryServiceGetById,
};
