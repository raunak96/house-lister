# HOUSE LISTER APP 

- Front-end: **ReactJS**
- Back-end: **Firebase v9**

### GEOCODE API
- [Go to https://positionstack.com/](https://positionstack.com/)
- Changed to **Mapbox** as positionstack is http in free tier hence our https app cant get resource from it.[Docs](https://docs.mapbox.com/).
  
### FILE UPLOAD IN FIREBASE STORAGE (In our case Image Upload)
- Read documentation at [https://firebase.google.com/docs/storage/web/upload-files](https://firebase.google.com/docs/storage/web/upload-files).

### ADDING MAP
- Package used - **react-leaflet** react version of **leaflet.js**
- Read documentation at [https://react-leaflet.js.org/](https://react-leaflet.js.org/).


### MOBILE TOUCH SLIDER EXPLORE AND LISTING PAGE
- Used **SwiperJS** for this. Documentation at [https://swiperjs.com/react](https://swiperjs.com/react).
- We have to add height property in css of parent slide container as its default height is 0. 


[![Time Spent](https://wakatime.com/badge/github/raunak96/house-lister.svg)](https://wakatime.com/badge/github/raunak96/house-lister)

### DEPLOYMENT NOTES
- Deployment on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
- Make sure to add Domain of deployed app to Authorized Domains in Settings in Firebase Authentication otherwise it will give error.