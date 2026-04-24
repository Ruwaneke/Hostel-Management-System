import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import yaml from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read all THREE YAML files
const maintenanceFile = fs.readFileSync(path.join(__dirname, 'maintenance-feedback.swagger.yaml'), 'utf8');
const roomFile = fs.readFileSync(path.join(__dirname, 'room-allocation.swagger.yaml'), 'utf8');
const bookingFile = fs.readFileSync(path.join(__dirname, 'booking-payment.swagger.yaml'), 'utf8');

// 2. Parse YAML to JSON objects
const maintenanceDoc = yaml.parse(maintenanceFile);
const roomDoc = yaml.parse(roomFile);
const bookingDoc = yaml.parse(bookingFile);

// 3. Merge the documents together into a single Swagger specification
const mergedSwaggerDocument = {
  openapi: maintenanceDoc.openapi || '3.0.3',
  info: {
    title: 'Hostel Management System API',
    version: '1.0.0',
    description: 'Combined Swagger documentation for Maintenance, Room Allocation, and Bookings/Payments.'
  },
  servers: maintenanceDoc.servers || [{ url: 'http://localhost:5025' }],
  components: {
    securitySchemes: maintenanceDoc.components?.securitySchemes || {},
    schemas: {
      ...maintenanceDoc.components?.schemas,
      ...roomDoc.components?.schemas,
      ...bookingDoc.components?.schemas
    }
  },
  security: maintenanceDoc.security || [],
  paths: {
    ...maintenanceDoc.paths,
    ...roomDoc.paths,
    ...bookingDoc.paths
  }
};

// 4. Export and mount the merged documentation
export function mountSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwaggerDocument, {
    customSiteTitle: "Hostel Management API Docs",
    swaggerOptions: {
      docExpansion: 'none', // Keeps lists collapsed by default
      filter: true // Adds a search bar to filter endpoints
    }
  }));
}