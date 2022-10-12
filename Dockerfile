FROM openjdk:8-jdk
ENV NODE_ENV development
# Add a work directory
WORKDIR /ongdb-graphene
# Cache and Install dependencies
# Copy app files
COPY . .
# Expose port
EXPOSE 8081
# Start the app
CMD ["java","-Xmx128m","-Dfile.encoding=utf-8","-jar","./lib/ongdb-graphene-1.0.0.jar"]
