module.exports = (sequelize, DataTypes) => {
  const claimantException = sequelize.define('claimantException', {
    claimantExceptionId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    frn: DataTypes.STRING,
    claimantGroup: DataTypes.STRING,
    isTrader: DataTypes.SMALLINT
  },
  {
    tableName: 'claimantExceptions',
    freezeTableName: true,
    timestamps: false
  })
  return claimantException
}
