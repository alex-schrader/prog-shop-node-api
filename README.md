This is the github repo for the Progressive Shopper node.js API. 

### Development
1. Make sure you have Node and npm installed
2. A .env file containing database auth information is required for development. You can email me (dzhen1@swarthmore.edu) for the file.
3. Run `npm install` in the same folder as `package.json`
4. Run `npm run dev`
5. The server should be live on `localhost:5000`. Changing any file will hot reload the server. 

### Deploying
Since this API is deployed on a EC2 instance, you will have to SSH into the EC2 instance to start, stop or re-deploy the server. Here are Amazon's instructions on how to do that: 
1. Open an SSH client.
2. Locate your private key file. The key used to launch this instance is sfc-node-api.pem. (Derrick speaking: you do not have this file and I cannot put it in the repo for security reasons. Email dzhen1@swarthmore.edu and I will send this file to you.)
3. Run this command, if necessary, to ensure your key is not publicly viewable.
 chmod 400 sfc-node-api.pem
4. Connect to your instance using its Public DNS:
 ec2-18-117-85-116.us-east-2.compute.amazonaws.com

### Remote testing
1. The server's public IP address is 18.117.85.116. The port on which the node process is running is 5000. So the API itself is live at 18.117.85.116:5000

### Routes
TODO (somebody do this): swagger documentation for Node.js API. Follow [this](https://www.section.io/engineering-education/documenting-node-js-rest-api-using-swagger/) guide.
- `brand/search/:input` Given a string user input, fuzzy matches the input to the nearest 5 brand names in the database.
- `brand/details/:slug` Given a slug (ex. `'google.com'`), returns details about the brand, its political contributions and the details/contributions of brands in the same category.
- `category/list` Gives a list of categories
- `category/search/:categoryName` Given a category name (has to case match category names in the db), returns aggregate political contribution details abt the category and also brand details / political contributions of brands within the category.
