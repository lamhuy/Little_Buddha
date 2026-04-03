this is a cross platform mobile app using expo. Utilizing fastlane to manage deployment to Google PlayStore and Apple Store. Using github action to manage CICD pipeline for deployment. Utilizing Detox as testing framework. The app should look modernize but calming. Target audience are kid to young adult. It is an education all app helping student to learn about Buddhism.

Project name is Little Buddha.
This project contains both front end which is the mobile applicaiton and the backend which is the API that the mobile app will consume. 

Backend will be deployed on AWS, backend infrastructure should leverage infrastructure as code pulumi.
Backend component includes API gateway to host API endpoint with JWT authentication, lambda function to handle business logic, and dynamodb to store data. 

Frontend to utitlize cognito managed login to allow user sign up for an account, verify email or reset password. setting up this cognito managed login and lambda hooks is part of the backend pulumi infrastructure. 

When user create an account, birth year, name / buddhish name is also collected. The registration save this info as attribute under cognito user. When generating the JWT, these attributes are added as claims

After user login, inspect the JWT for name and birth year. Welcome the user by name. Based on the birth year, present the different lesson plan to be defined below.

Age 0-7 are collections of Buddhism stories appropriate for younge learner. These are simple stories with moral such as  THe prince and the Silver Swan etc

Age 8-12 are collection of More indepth stories of buddhism teaching, history of Buddha birth and basic principles, mosquito and the capenters etc. 

Aage 13-18 are collection of the four noble truths, the eight fold path, and other core teachings of Buddhism. 

These stories are stories in dynamo and is fetch by mobile app from backend API

The stories is also accommidate with audio to read the content outloud. After each story, a bullet point summary is presented. Next are the set of questions about the content that was just presented to facility discussion amount the students. 

