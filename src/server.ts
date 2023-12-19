import app from "./app";
import connection from "./db/connect";

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connection(process.env.DATABASE_URI)
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}....`);
    });
  } catch (err) {
    console.log("ERROR!: " + err);
  }
};

start();
