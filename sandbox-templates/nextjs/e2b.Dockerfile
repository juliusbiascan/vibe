FROM node:21-slim

# Install required tools
RUN apt-get update && apt-get install -y bash curl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the script and ensure it has executable permissions
COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh
RUN ls -l /  # Debugging step to verify the file is copied

# Set the working directory
WORKDIR /home/user/nextjs-app

# Install Next.js and shadcn dependencies
RUN npx --yes create-next-app@15.3.3 . --yes
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move the Next.js app to the home directory and clean up
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
