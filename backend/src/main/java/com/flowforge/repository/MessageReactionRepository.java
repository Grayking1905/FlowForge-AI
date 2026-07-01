package com.flowforge.repository;

import com.flowforge.entity.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {
    List<MessageReaction> findByMessageId(Long messageId);

    Optional<MessageReaction> findByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);

    @Query("SELECT r.emoji, COUNT(r) FROM MessageReaction r WHERE r.message.id = :messageId GROUP BY r.emoji")
    List<Object[]> countByMessageGroupByEmoji(@Param("messageId") Long messageId);
}
