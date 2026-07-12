const corsOptions = {
  origin: [
    "https://project-x-three-virid.vercel.app",
    "http://localhost:5173"
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

module.exports = corsOptions;