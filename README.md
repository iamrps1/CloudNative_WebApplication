# SmartGrades Based on Cloud Native Evaluator Application

SmartGrades is a cloud based platform designed for secure development and deployment of the software.It contains an automated CI/CD pipeline that integrates the continuous security scanning with Sonarqube and Synk.

## Project Content
This project is divided into two layers:
* **Application Layer**: It contains both Frontend components(HTML/CSS/JavaScript/React) and Backend component(Nextjs). They are used to make the server for the project and storing the database in it securely.
* **Cloud Infrastructure and Deployment Layer**: it contains all the infrastructure and deployment tools for storing data securely, solving security issues and automation for the security. And Route 53 DNS for using the local user name for the website. 

# Technology Used
* **Frontend(HTML/CSS/JavaScript/React)** : Creates the applications UI.
* **Backend(Next.js)**: It processes the grading logic and connects the databases, nextjs allows to create the server side api endpoints and also used for SSR(Server Side Rendering).
* **Database(AWS RDS)**: Stores all the application data securely.
* **WebP Format**: It optimizes the images to make the application faster.
* **GitLab CI/CD**: It automates the testing and deployment to avoid the manual work.
* **SonarQube/Synk**: It secures the code and dependencies from vulnerabilities.
* **AWS S3**: It stores the scanned answer sheet and data securely.
* **AWS Lambda**: it handles lightweight and automated tasks.
* ** AWS Route 53**: It routes the user to the correct server using domain name.
* **Prometheus**: It monitors how the application is performing in the real-time.
* **Grafana**: Visualizes system metrics and application health clearly.
