export function createRepository(delegate) {
  return Object.freeze({
    findById: (id, options = {}) => delegate.findUnique({ where: { id }, ...options }),
    findMany: (options = {}) => delegate.findMany(options),
    create: (data, options = {}) => delegate.create({ data, ...options }),
    update: (id, data, options = {}) => delegate.update({ where: { id }, data, ...options }),
    delete: (id) => delegate.delete({ where: { id } }),
  });
}
