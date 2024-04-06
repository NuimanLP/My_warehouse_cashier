'use strict';

const booking = require('../routes/product');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({

    async getProductInfo(ctx) {
    if (!ctx.state.user) {
      return ctx.badRequest('No user found.');
    }

    try {
      const entities = await strapi.entityService.findMany('api::product.product', {
        populate: {
          Shot: true,
        },
      });
      console.log(entities);

      const products = entities.map(entity => ({
        id: entity.id,
        Product_name: entity.Product_name,
        Barcode: entity.Barcode,
        Pricing: entity.Pricing,
        StockQuantity: entity.StockQuantity,
        Description: entity.Description,
        Branding: entity.Branding,
        Category: entity.Category,
        Shot: entity.Shot
      }));
      return products
    } catch (error) {
      console.error('Error fetching products:', error);
      return ctx.internalServerError('Error fetching products.');
    }
  },
}));
