# This file is a template, and might need editing before it works on your project.

# Start with a base image containing Java runtime
FROM 192.168.0.11:5000/start-java8:v1

# Add Author info
LABEL maintainer="lx's project developer"

# Add a volume to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 9000

# The application's jar file
# 이름만 변경해서 사용하세요 
ARG JAR_FILE=target/customs-0.0.1-SNAPSHOT.war

# spring profiles
ARG SPRING_PROFILES_ACTIVE
RUN echo "PROFILE : "$SPRING_PROFILES_ACTIVE
ENV SPRING_PROFILES_ACTIVE=$SPRING_PROFILES_ACTIVE

# Add the application's jar to the container
ADD ${JAR_FILE} to-do-springboot.war

# Run the jar file
ENTRYPOINT ["java","-Dpname=customs","-Djava.security.egd=file:/dev/./urandom","-jar","/to-do-springboot.war"]

