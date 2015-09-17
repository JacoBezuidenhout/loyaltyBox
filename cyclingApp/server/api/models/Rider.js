module.exports = {

autoPK: false,

  attributes: {
  	id: {
      type: 'integer',
      unique: true,
      primaryKey: true
    },
  	updates: {collection: "Update", via: "rider"}
  }
};