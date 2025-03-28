export const safeSetItem = async (key: string, value: any) => {
  const compressData = (data: any) => {
    if (typeof data !== 'object' || data === null) return data;

    // Compression spécifique pour les images base64
    if (data.image && data.image.startsWith('data:image')) {
      const quality = 0.5; // Réduire la qualité de l'image
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = Math.min(800, img.width); // Max width 800px
          canvas.height = (img.height * canvas.width) / img.width;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          data.image = canvas.toDataURL('image/jpeg', quality);
          resolve(data);
        };
        img.src = data.image;
      });
    }

    // Compression des autres données
    const essentialUserKeys = ['id', 'firstName', 'lastName', 'image', 'username', 'email'];
    const essentialProfileKeys = [...essentialUserKeys, 'phone', 'birthDate', 'gender'];
    
    return Object.keys(data).reduce((acc, key) => {
      if (key === 'userProfile' && data[key]) {
        acc[key] = Object.keys(data[key]).reduce((profile: any, k) => {
          if (essentialProfileKeys.includes(k)) {
            profile[k] = data[key][k];
          }
          return profile;
        }, {});
      } else if (essentialUserKeys.includes(key)) {
        acc[key] = data[key];
      }
      return acc;
    }, {} as any);
  };

  try {
    let compressedValue = await compressData(value);
    const dataString = JSON.stringify(compressedValue);
    
    try {
      localStorage.setItem(key, dataString);
      return true;
    } catch (e) {
      // Si échec, nettoyer et réessayer
      const keysToKeep = ['currentUser'];
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const storageKey = localStorage.key(i);
        if (storageKey && !keysToKeep.includes(storageKey)) {
          localStorage.removeItem(storageKey);
        }
      }
      
      localStorage.setItem(key, dataString);
      return true;
    }
  } catch (e) {
    console.warn('Storage error:', e);
    return false;
  }
};
