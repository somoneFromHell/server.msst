const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');


mongoose
	.connect(process.env.DATABASE_CONNECTION_STRING)
	.then(() => {
		console.log('✅ DB connection established');
	})
	.catch((err) => {
		console.log('DB CONNECTION FAILED ‼️');
		console.log('ERR: ', err);
	});

// Catching uncaught exception ->>
process.on('unCaughtException', (err) => {
	console.log(`UNCAUGHT EXCEPTION -> ${err.name} - ${err.message}`);
	console.log('App SHUTTING DOWN...');
	process.exit(1); // <- Then will shut down the server.
});

// Starting Server ->>
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running at port`, (`${port}`), '...');
});


// Catching unHandleled Rejections ->
process.on('unhandledRejection', (err) => {
	console.log(`UNHANDELLED REJECTION -> ${err.name} - ${err.message}`);
	console.log(err);
	console.log('App SHUTTING DOWN...');
	server.close(() => {	// <- This will first terminate all requests
		
		process.exit(1); // <- Then will shut down the server.
	});
});

