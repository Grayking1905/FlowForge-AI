package com.flowforge.repository;

import com.flowforge.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
    @Query("SELECT c FROM Channel c JOIN c.members m WHERE m.id = :userId ORDER BY c.name ASC")
    List<Channel> findByMemberId(@Param("userId") Long userId);

    List<Channel> findByType(String type);
}
