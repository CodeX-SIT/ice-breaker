export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { sequelize } = await import("./database");
    await sequelize.sync();
  }
}
