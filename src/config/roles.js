const allRoles = {
  user: ['register', 'login', 'getProducts', 'getProductById', 'logout', 'addItemsToCart', 'removeItemsFromCart', 'getCart', 'clearCart'],
  admin: ['getUsers', 'getUserById', 'deleteUserById', 'createProducts', 'updateProductById', 'deleteProductById'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
