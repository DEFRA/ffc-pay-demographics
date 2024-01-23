module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    countryId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    countryCode: DataTypes.STRING
  },
  {
    tableName: 'countries',
    freezeTableName: true,
    timestamps: false
  })
  return country
}
