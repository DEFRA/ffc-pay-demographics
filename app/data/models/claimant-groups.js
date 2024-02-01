module.exports = (sequelize, DataTypes) => {
  const claimantGroup = sequelize.define('claimantGroup', {
    claimantGroupId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    businessTypeId: DataTypes.INTEGER,
    rpGroup: DataTypes.STRING,
    daxGroup: DataTypes.STRING,
    isTrader: DataTypes.BOOLEAN
  },
  {
    tableName: 'claimantGroups',
    freezeTableName: true,
    timestamps: false
  })
  return claimantGroup
}
