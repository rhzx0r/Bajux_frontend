import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX, MoveVertical as MoreVertical, User } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ShortsScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set(['1'])); // First video auto-plays
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const shorts = [
    {
      id: '1',
      type: 'service',
      author: 'Carlos Méndez',
      service: 'Plomería',
      description: 'Reparando una fuga en tiempo récord 💧 #plomeria #reparacion #profesional',
      thumbnail: 'https://images.pexels.com/photos/8472749/pexels-photo-8472749.jpeg?auto=compress&cs=tinysrgb&w=400',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      likes: 245,
      comments: 18,
      shares: 12,
      duration: '0:45',
      verified: true,
    },
    {
      id: '2',
      type: 'store',
      author: 'Ferretería El Martillo',
      service: 'Ferretería',
      description: 'Nuevos productos llegaron hoy! 🔨 Todo lo que necesitas para tu proyecto #ferreteria #herramientas',
      thumbnail: 'https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=400',
      avatar: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=100',
      likes: 189,
      comments: 24,
      shares: 8,
      duration: '0:32',
      verified: false,
    },
    {
      id: '3',
      type: 'service',
      author: 'María González',
      service: 'Jardinería',
      description: 'Transformación completa de jardín 🌱 Antes y después increíble #jardineria #paisajismo',
      thumbnail: 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=400',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      likes: 312,
      comments: 45,
      shares: 23,
      duration: '1:12',
      verified: true,
    },
    {
      id: '4',
      type: 'store',
      author: 'Restaurante La Cocina',
      service: 'Restaurante',
      description: 'Preparando nuestros tacos especiales del día 🌮 ¡Ven a probarlos! #comida #tacos #mexicano',
      thumbnail: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      avatar: 'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=100',
      likes: 156,
      comments: 32,
      shares: 15,
      duration: '0:28',
      verified: false,
    },
    {
      id: '5',
      type: 'service',
      author: 'Juan Pérez',
      service: 'Electricidad',
      description: 'Instalación de panel eléctrico paso a paso ⚡ Seguridad ante todo #electricidad #instalacion',
      thumbnail: 'https://images.pexels.com/photos/5691608/pexels-photo-5691608.jpeg?auto=compress&cs=tinysrgb&w=400',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      likes: 278,
      comments: 19,
      shares: 11,
      duration: '0:55',
      verified: true,
    },
  ];

  const togglePlay = (videoId: string) => {
    setPlayingVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const toggleMute = (videoId: string) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleProfilePress = (short: typeof shorts[0]) => {
    if (short.type === 'service') {
      router.push(`/service/${short.id}`);
    } else {
      router.push(`/store/${short.id}`);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
          setCurrentIndex(index);
        }}
        style={styles.scrollView}
      >
        {shorts.map((short, index) => (
          <View key={short.id} style={styles.shortContainer}>
            {/* Video/Image Container */}
            <TouchableOpacity
              style={styles.videoContainer}
              onPress={() => togglePlay(short.id)}
              activeOpacity={1}
            >
              <Image source={{ uri: short.thumbnail }} style={styles.videoThumbnail} />
              
              {/* Play/Pause Overlay */}
              {!playingVideos.has(short.id) && (
                <View style={styles.playOverlay}>
                  <View style={styles.playButton}>
                    <Play size={40} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                </View>
              )}
              
              {/* Duration Badge */}
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{short.duration}</Text>
              </View>
              
              {/* Mute/Unmute Button */}
              <TouchableOpacity
                style={styles.muteButton}
                onPress={() => toggleMute(short.id)}
              >
                {mutedVideos.has(short.id) ? (
                  <VolumeX size={20} color="#FFFFFF" />
                ) : (
                  <Volume2 size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Content Overlay */}
            <View style={styles.contentOverlay}>
              {/* Left Side - Profile Info */}
              <View style={styles.leftContent}>
                <TouchableOpacity
                  style={styles.profileSection}
                  onPress={() => handleProfilePress(short)}
                >
                  <Image source={{ uri: short.avatar }} style={styles.avatar} />
                  <View style={styles.profileInfo}>
                    <View style={styles.authorRow}>
                      <Text style={styles.authorName}>{short.author}</Text>
                      {short.verified && (
                        <View style={styles.verifiedBadge}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.serviceType}>{short.service}</Text>
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.description}>{short.description}</Text>
              </View>

              {/* Right Side - Actions */}
              <View style={styles.rightActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleLike(short.id)}
                >
                  <Heart
                    size={28}
                    color={likedPosts.has(short.id) ? "#FF6B6B" : "#FFFFFF"}
                    fill={likedPosts.has(short.id) ? "#FF6B6B" : "none"}
                  />
                  <Text style={styles.actionText}>
                    {formatNumber(short.likes + (likedPosts.has(short.id) ? 1 : 0))}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={28} color="#FFFFFF" />
                  <Text style={styles.actionText}>{formatNumber(short.comments)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Share size={28} color="#FFFFFF" />
                  <Text style={styles.actionText}>{formatNumber(short.shares)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <MoreVertical size={28} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bajux Shorts</Text>
        <TouchableOpacity style={styles.searchButton}>
          <User size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  shortContainer: {
    width: screenWidth,
    height: screenHeight,
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 20,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 32,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  muteButton: {
    position: 'absolute',
    top: 120,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 20,
  },
  leftContent: {
    flex: 1,
    marginRight: 20,
    marginTop: 110,
    marginBottom: 0,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceType: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  rightActions: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: 8,
  },
});