[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Duc-ju/grade-ptit">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">GRADE PTIT</h3>

  <p align="center">
    A grade management tool for PTIT student
    <br />
    <br />
    <a href="https://gradeptit.web.app/">View Demo</a>
    ·
    <a href="https://github.com/Duc-ju/grade-ptit/issues">Report Bug</a>
    ·
    <a href="https://github.com/Duc-ju/grade-ptit/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Features:

* Calculate the final score based on component scores, you can choose the score structure of the subject, for example
  10-10-70 or 10-10-20-60, etc.
* Create, update and view profile lists, each profile will include a complete list of subjects in all semesters that you
  must undergo at PTIT for 4 or 4.5 years of study.
* Estimated study score improvement. You can import grades from semesters that already have grades by exporting grades
  on the training management page and importing grades in the grade estimation function. You can edit the improvement
  score you want to see the change in GPA. Or you can try entering your scores in advance in the coming semesters to
  determine the goals you need to achieve to get 2.5, 3.2, 3.6 when you graduate.
* With profiles you set as public, other users can search and view details of that profile. So you can also easily share
  your profile for others to see.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

[![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You need to create firebase project with your email. After that, you need to allow connection to firebase project and
firestore database.

* Create your own firebase project [Firebase console](https://console.firebase.google.com/).
* Enable web app on your firebase project. The given npm initialize Firebase will like that:

```
...
const firebaseConfig = {
  apiKey: your_value,
  authDomain: your_value,
  databaseURL: your_value,
  projectId: your_value,
  storageBucket: your_value,
  messagingSenderId: your_value,
  appId: your_value,
  measurementId: your_value
};
...
```

* Go to firestore database menu, create database and set the Rules to (just for dev environment):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

* Also enable user and password authentication, storage service in your firebase project.

### Installation

_When you've already had your own Firebase project, let's start up our local instance._

1. Clone the repo

```sh
git clone https://github.com/Duc-ju/grade-ptit.git
```

2. Install NPM packages

```sh
npm install
```

3. create `.env` file in the root level, include your Firebase configuration value to this.

```
REACT_APP_FIREBASE_API_KEY=${YOUR_VALUE}
REACT_APP_AUTH_DOMAIN=${YOUR_VALUE}
REACT_APP_PROJECT_ID=${YOUR_VALUE}
REACT_APP_STORAGE_BUCKET=${YOUR_VALUE}
REACT_APP_MESSAGING_SENDER_ID=${YOUR_VALUE}
REACT_APP_APP_ID=${YOUR_VALUE}
REACT_APP_MEASUREMENT_ID=${YOUR_VALUE}
```

4. Start project

```
npm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

See the [open issues](https://github.com/Duc-ju/grade-ptit/issues) for a full list of proposed features (
and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any
contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also
simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Grade Ptit - [@Grade Ptit](https://www.facebook.com/gradeptit) - gradeptit@gmail.com

Project Link: [https://github.com/Duc-ju/grade-ptit](https://github.com/Duc-ju/grade-ptit)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

I've included a few of my favorites to kick things off!

* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Duc-ju/grade-ptit.svg?style=for-the-badge

[contributors-url]: https://github.com/Duc-ju/grade-ptit/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/Duc-ju/grade-ptit.svg?style=for-the-badge

[forks-url]: https://github.com/Duc-ju/grade-ptit/network/members

[stars-shield]: https://img.shields.io/github/stars/Duc-ju/grade-ptit.svg?style=for-the-badge

[stars-url]: https://github.com/Duc-ju/grade-ptit/stargazers

[issues-shield]: https://img.shields.io/github/issues/Duc-ju/grade-ptit.svg?style=for-the-badge

[issues-url]: https://github.com/Duc-ju/grade-ptit/issues

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[product-screenshot]: images/screenshot.png

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB

[React-url]: https://reactjs.org/