<h1 align="center">Welcome to Knowza.io 👋</h1>
<p align="center">
    <img src="https://img.shields.io/github/actions/workflow/status/VVB2/Library_Management_System/publish-docker-images.yml?branch=main&style=flat-square" />
    <img src="https://img.shields.io/github/contributors/VVB2/Library_Management_System?style=flat-square" />
    <img src="https://img.shields.io/librariesio/github/VVB2/Library_Management_System?style=flat-square" />
    <img src="https://img.shields.io/github/repo-size/VVB2/Library_Management_System?style=flat-square" />
    <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-yellow.svg?style=flat-square" target="_blank" />
</p>

> Backend useful to move from traditional pen paper library management system to modern automation and database approach.

## ⛳ Introduction 
- A college library management is a project that manages and stores books information electronically according to students needs. The system helps both students and library manager to keep a constant track of all the books available in the library. </br>
- It allows both the admin and the student to search for the desired book. It becomes necessary for colleges to keep a continuous check on the books issued and returned and even calculate fine. </br>
- This task if carried out manually will be tedious and includes chances of mistakes. These errors are avoided by allowing the system to keep track of information such as issue date, last date to return the book and even fine information and thus there is no need to keep manual track of this information which thereby avoids chances of mistakes. </br>
- Thus this system reduces manual work to a great extent allows smooth flow of library activities by removing chances of errors in the details.

## 📄 Prerequisites
- Git should be installed on your machine in not install it by visiting [here](https://git-scm.com/downloads).
- Docker should be installed on your machine. Can be installed [here](https://www.docker.com/products/docker-desktop/).


## 🚀 Usage
1. Clone this repo using:
```
git clone https://github.com/VVB2/Library_Management_System.git
```
2. Create a `.env` file in all root folders of `/server`.
3. `AdminMicroservice, NotificationMicroservice, PaymentMicroservice and UserMicroservice` env file must contain:
```
MONGO_URI
LOG_FOLDER
LOG_FILENAME
PORT
JWT_SECRET
JWT_EXPIRE
RABBITMQ_URI
```
4. `PaymentMicroservice` must contain:
```
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
```
5. `NotificationMicroservice` must contain:
```
MAILTRAP_USER
MAILTRAP_PASSWORD
FRONTEND_URL
```
6. `WebScrappingMicroservice` must contain:
```
MONGO_URI
```
7. Run each `docker-compose.yml` file to run the docker container.

## 🤔 Proposed Methodology
![Proposed Methodology](System%20Design/Proposed%20Methodology.png)

## 🎨 System Design
- Flow Diagram
![Flow Diagram](System%20Design/Knowza.io%20-%20Flow%20Diagram.png)

- ER Diagram
![ER Diagram](System%20Design/Knowza.io%20-%20ER%20Diagram.png)

- Use Case
![Use Case](System%20Design/Knowza.io%20-%20Use%20case%20diagram.png)

- Activity Diagram
![Activity Diagram](System%20Design/Knowza.io%20-%20Activity%20Diagram.png)

## 🛠 Modern Tools
<table>
    <thead>
        <tr class="header">
            <th style="text-align: center;" colspan=2>Frontend</th>
            <th style="text-align: center;" colspan=2>Backend</th>
            <th style="text-align: center;" colspan=2>Microservice</th>
            <th style="text-align: center;" colspan=2>Deployment</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="text-align: center;">Framework</td>
            <td style="text-align: center;">Next JS</td>
            <td style="text-align: center;">Server</td>
            <td style="text-align: center;">Flask and Node JS</td>
            <td style="text-align: center;">Web Scraping</td>
            <td style="text-align: center;">Selenium</td>
            <td style="text-align: center;">VCS</td>
            <td style="text-align: center;">Git/GitHub</td>
        </tr>
        <tr>
            <td style="text-align: center;">CSS Library</td>
            <td style="text-align: center;">Minimal UI</td>
            <td style="text-align: center;">Database</td>
            <td style="text-align: center;">MongoDB</td>
            <td style="text-align: center;">CSV Data manipulation</td>
            <td style="text-align: center;">Python</td>
            <td style="text-align: center;">CI/CD</td>
            <td style="text-align: center;">Netlify</td>
        </tr>
        <tr>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;">Authentication</td>
            <td style="text-align: center;">JWT</td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
        </tr>
        <tr>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;">Payment Gateway</td>
            <td style="text-align: center;">Stripe JS</td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
            <td style="text-align: center;"></td>
        </tr>
    </tbody>
</table>

## 💻 Code Contributors
<a href="https://github.com/VVB2/Library_Management_System/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=VVB2/Library_Management_System" />
</a>

## 👤 Author
🙃 Vinod Vaman Bhat
- GitHub: [@VVB2](https://github.com/VVB2)
- Portfolio Website: [@VVB](https://snazzy-tartufo-6f8f42.netlify.app/)

## 📃 License
Copyright © 2022 [Vinod Vaman Bhat](https://github.com/VVB2). <br>
This project is [MIT](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE) licensed.