// File: src/app/api/navigate/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { digipin } = await request.json();

    if (!digipin) {
      return NextResponse.json({ message: 'DIGIPIN is required' }, { status: 400 });
    }

    const officialApiUrl = `https://dac.indiapost.gov.in/ws/mydigipin/getCoordinates?reqid=${digipin}`;
    const apiResponse = await axios.get(officialApiUrl);

    // --- THIS IS THE IMPORTANT DEBUGGING LINE ---
    console.log('SERVER RESPONSE RECEIVED:', JSON.stringify(apiResponse.data, null, 2));
    // ---------------------------------------------

    if (apiResponse.data && apiResponse.data.data && apiResponse.data.data.coordinates) {
      const coordsString = apiResponse.data.data.coordinates;
      const [lat, lon] = coordsString.split(', ');
      return NextResponse.json({ lat, lon });
    } else {
      throw new Error('Invalid response structure from API');
    }
  } catch (error: any) {
    console.error('[API_ERROR]', error.message);
    return NextResponse.json({ message: 'Failed to fetch data from the DIGIPIN service.' }, { status: 500 });
  }
}