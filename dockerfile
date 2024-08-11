# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight server to serve the static files
RUN npm install -g serve

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
