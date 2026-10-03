module.exports = async function (context, req) {
  context.res = { body: { mensaje: "Hola desde mi API serverless" } };
};
