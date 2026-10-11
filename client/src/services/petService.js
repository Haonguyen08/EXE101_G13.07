import api from './authService';

export const petService = {
  // Lấy tất cả thú cưng công khai từ database MongoDB
  getAllPublicPets: async () => {
    const response = await api.get('/public/pets');
    return response.data;
  },

  // Lấy chi tiết thú cưng theo mã petCode
  getPublicPetByCode: async (petCode) => {
    const response = await api.get(`/public/pets/${petCode}`);
    return response.data;
  },
};

export default petService;
