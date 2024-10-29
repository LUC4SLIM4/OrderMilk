import { useState, useEffect } from 'react';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

const useFirebaseData = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firebase.firestore()
          .collection('producao_semanal')
          .orderBy('dia')
          .limit(7)
          .get();

        const data = snapshot.docs.map(doc => ({
          dia: doc.data().dia,
          producao: doc.data().producao
        }));

        const labels = data.map(item => item.dia);
        const datasets = [{
          data: data.map(item => item.producao)
        }];

        setChartData({ labels, datasets });
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { chartData, loading, error };
};

export default useFirebaseData;