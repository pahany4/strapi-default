module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'b1b868cbe9ad0ae445ed050f337fd215'),
  },
});
