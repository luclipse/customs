# This file is a template, and might need editing before it works on your project.

# Start with a base image containing Java runtime
FROM 192.168.0.11:5000/gitlabci:v1

# Add Author info
LABEL maintainer="lx's project developer"

# Add a volume to /tmp
VOLUME /tmp

# Make port 8080 available to the world outside this container
EXPOSE 9001

# The application's jar file
# 이름만 변경해서 사용하세요 
ARG JAR_FILE=target/customs-0.0.1-SNAPSHOT.jar

# Add the application's jar to the container
ADD ${JAR_FILE} to-do-springboot.jar

# Run the jar file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/to-do-springboot.jar"]

