const express = require('express');
const router = express.Router();
const { getAllPublicPets, getPublicPetByCode } = require('../controllers/publicController');

router.get('/pets', getAllPublicPets);
router.get('/pets/:petCode', getPublicPetByCode);

module.exports = router;
