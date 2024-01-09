module.exports = (sequelize, DataTypes) => {
  const claimantGroup = sequelize.define('claimantGroup', {
    claimantGroupId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rpGroup: DataTypes.STRING,
    daxGroup: DataTypes.STRING,
    isTrader: DataTypes.SMALLINT
  },
  {
    tableName: 'claimantGroups',
    freezeTableName: true,
    timestamps: false
  })
  return claimantGroup
}
