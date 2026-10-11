const Pet = require('../models/Pet');
const Account = require('../models/Account');
const Profile = require('../models/Profile');
const EmergencyAlert = require('../models/EmergencyAlert');
const QRCode = require('../models/QRCode');

/**
 * @desc    Lấy danh sách tất cả thú cưng trong database (Public)
 * @route   GET /api/public/pets
 * @access  Public
 */
const getAllPublicPets = async (req, res) => {
  try {
    const pets = await Pet.find().populate('ownerId', 'username email');

    // Nạp thêm Profile, EmergencyAlert, QRCode cho từng Pet từ MongoDB
    const fullPets = await Promise.all(
      pets.map(async (pet) => {
        const [profile, emergency, qr] = await Promise.all([
          Profile.findOne({ accountId: pet.ownerId?._id }),
          EmergencyAlert.findOne({ petId: pet._id }),
          QRCode.findOne({ petId: pet._id }),
        ]);

        return {
          _id: pet._id,
          petCode: pet.petCode,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          sex: pet.sex,
          birthday: pet.birthday,
          weight: pet.weight,
          avatarUrl: pet.avatarUrl,
          bio: pet.bio,
          microchip: '98109810' + (pet.petCode.replace(/\D/g, '') || '001'),
          issueDate: new Date(pet.createdAt).toLocaleDateString('vi-VN'),
          owner: {
            username: pet.ownerId?.username || '',
            fullName: profile?.fullName || pet.ownerId?.username || 'Chủ nuôi',
            phone: profile?.phone || '',
            address: profile?.address || '',
          },
          emergency: {
            allergies: emergency?.allergies || [],
            medications: emergency?.medications || [],
            specialNote: emergency?.specialNote || pet.bio || '',
          },
          qrCode: {
            qrUrl: qr?.qrUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/p/${pet.petCode}`,
            qrImageUrl: qr?.qrImageUrl || '',
            scanCount: qr?.scanCount || 0,
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: fullPets.length,
      data: fullPets,
    });
  } catch (error) {
    console.error('[getAllPublicPets Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy danh sách thú cưng từ database.',
      error: error.message,
    });
  }
};

/**
 * @desc    Lấy thông tin chi tiết thú cưng theo petCode khi quét QR (Public)
 * @route   GET /api/public/pets/:petCode
 * @access  Public
 */
const getPublicPetByCode = async (req, res) => {
  try {
    const { petCode } = req.params;
    const pet = await Pet.findOne({ petCode }).populate('ownerId', 'username email');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thú cưng với mã ${petCode} trong hệ thống.`,
      });
    }

    // Tăng scanCount trong QRCode collection
    const qrRecord = await QRCode.findOneAndUpdate(
      { petId: pet._id },
      { $inc: { scanCount: 1 } },
      { new: true }
    );

    const [profile, emergency] = await Promise.all([
      Profile.findOne({ accountId: pet.ownerId?._id }),
      EmergencyAlert.findOne({ petId: pet._id }),
    ]);

    const formattedData = {
      _id: pet._id,
      petCode: pet.petCode,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      birthday: pet.birthday,
      weight: pet.weight,
      avatarUrl: pet.avatarUrl,
      bio: pet.bio,
      microchip: '98109810' + (pet.petCode.replace(/\D/g, '') || '001'),
      issueDate: new Date(pet.createdAt).toLocaleDateString('vi-VN'),
      owner: {
        username: pet.ownerId?.username || '',
        fullName: profile?.fullName || pet.ownerId?.username || 'Chủ nuôi',
        phone: profile?.phone || '',
        address: profile?.address || '',
      },
      emergency: {
        allergies: emergency?.allergies || [],
        medications: emergency?.medications || [],
        specialNote: emergency?.specialNote || pet.bio || '',
      },
      qrCode: {
        qrUrl: qrRecord?.qrUrl || `${process.env.CLIENT_URL || 'http://localhost:5173'}/p/${pet.petCode}`,
        qrImageUrl: qrRecord?.qrImageUrl || '',
        scanCount: qrRecord?.scanCount || 1,
      },
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error('[getPublicPetByCode Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy thông tin thú cưng.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllPublicPets,
  getPublicPetByCode,
};
