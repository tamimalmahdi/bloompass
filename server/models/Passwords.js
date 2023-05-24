module.exports = (sequelize, DataTypes) => {
  const Passwords = sequelize.define("Passwords", {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seed: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    filterSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arraySize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Passwords;
};
