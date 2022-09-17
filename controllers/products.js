const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  const search = "alb";
  const products = await Product.find({}).select('name price');
  res.status(200).json({products, nbHits: products.length});
}

const getAllProducts = async (req, res) => {
  const {featured, company, name, sort, fields} = req.query;
  const queryObject = {};

  if(featured){
    queryObject.featured = featured === 'true';
  }

  if(company){
    queryObject.company = company;
  }

  if(name){
    queryObject.name = {$regex: name, $options: 'i'};
  }

  let result = Product.find(queryObject);

  // sorting
  if(sort) {
    const sortList = sort.split(/[,.\s]/).join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if(fields) {
    const fieldsList = fields.split(/[,.\s]/).join(' ');
    result = result.select(fieldsList);
  }

  let products = await result;

  res.status(200).json({products, nbHits: products.length});
}

module.exports = {
  getAllProducts,
  getAllProductsStatic
}