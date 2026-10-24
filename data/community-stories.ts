import type { EditorialRecord } from '@/lib/editorial'

export type CommunityStory = EditorialRecord & {
  introduction?: string
  localImage?: { src: string; width: number; height: number; alt: string }
  takeaway?: string
}

const base: EditorialRecord = { status: 'published', title: '', text: '', name: '', category: '', source: 'Thông tin và hình ảnh hoạt động của Khu phố 19.', verifiedBy: '', verifiedOn: '', date: '', url: '', photographer: '', permission: '', period: '', value: 0, type: '' }

export const COMMUNITY_STORIES: CommunityStory[] = [
  {
    ...base, id: 'hanh-trinh-ve-nguon-phuoc-hoi', category: 'Về nguồn & giao lưu',
    title: 'Về nguồn để thêm gắn bó',
    introduction: 'Từ chuyến thăm, tìm hiểu lịch sử đến buổi giao lưu cùng ấp Phước Hội, xã Dương Minh Châu: một hành trình nối ký ức với tình cộng đồng hôm nay.',
    localImage: { src: '/images/kp19/nổi bật.jpg', width: 1500, height: 1692, alt: 'Đoàn Khu phố 19 tại Khu di tích lịch sử căn cứ Dương Minh Châu và giao lưu cùng ấp Phước Hội' },
    text: 'Có những chuyến đi giúp chúng ta hiểu thêm về một vùng đất, cũng có những chuyến đi khiến mỗi người nhìn lại trách nhiệm của mình với nơi đang sống. Trong hành trình thăm, tìm hiểu lịch sử và giao lưu cùng ấp Phước Hội, xã Dương Minh Châu, chúng ta có dịp kết nối hai điều ấy.\nChúng ta cùng lưu lại những khoảnh khắc tại Khu di tích lịch sử căn cứ Dương Minh Châu và trong chương trình giao lưu, trao đổi, học tập kinh nghiệm. Từ không gian di tích đến bàn giao lưu, câu chuyện lịch sử được nối tiếp bằng sự gặp gỡ giữa những người đang góp sức cho cộng đồng.\nTìm hiểu quá khứ cũng là một cách vun đắp cách sống hôm nay: trân trọng những điều đã được gìn giữ, lắng nghe kinh nghiệm của nhau và mang tinh thần đoàn kết về với khu phố. Giá trị của hành trình vì thế còn ở những kết nối có thể tiếp tục sau chuyến đi.',
    takeaway: 'Mang theo một điều đã học, giữ lại một mối gắn kết và bắt đầu từ một việc có ích cho nơi mình sống.',
  },
  {
    ...base, id: 'se-chia-tu-nhung-dieu-binh-di', category: 'Người tốt, việc tốt',
    title: 'Điều tử tế bắt đầu từ sự quan tâm',
    introduction: 'Một lời thăm hỏi, một phần quà được trao tận tay. Những việc làm gần gũi góp thêm hơi ấm cho đời sống khu phố.',
    localImage: { src: '/images/kp19/việc tốt.jpg', width: 1020, height: 720, alt: 'Thăm hỏi tại nhà và trao quà sẻ chia cùng người dân trong các hoạt động của Khu phố 19' },
    text: 'Sự quan tâm đôi khi bắt đầu rất giản dị: đến thăm một người lớn tuổi, ngồi lại hỏi han hay trao một phần quà. Trong những hình ảnh của Khu phố 19, điều đọng lại là sự gần gũi giữa người đến thăm và người được sẻ chia.\nQua những cuộc thăm hỏi tại nhà, chúng ta gửi trao những phần quà và nhu yếu phẩm tận tay người được hỗ trợ. Đoàn viên và bà con cùng góp sức, cùng quan tâm đến những người bên cạnh mình.\nMột việc tốt không cần bắt đầu từ điều lớn lao. Nhận ra một nhu cầu, hỏi xem mình có thể giúp gì và hành động trong khả năng là cách mỗi người có thể tiếp nối sự quan tâm ấy. Khi được thực hiện với sự tôn trọng, những việc nhỏ trở thành sợi dây gắn kết hàng xóm với nhau.',
    takeaway: 'Hỏi thăm một người quanh bạn và lắng nghe điều họ thực sự cần trước khi giúp đỡ.',
  },
  {
    ...base, id: 'an-sinh-gop-nhung-phan-se-chia', category: 'An sinh & nghĩa tình',
    title: 'Góp những phần sẻ chia, vun tình khu phố',
    introduction: 'Những phần quà, nhu yếu phẩm và sinh hoạt cộng đồng kể một câu chuyện chung: cùng nhau chăm lo đời sống từ những điều thiết thực.',
    localImage: { src: '/images/kp19/an sinh.jpg', width: 1000, height: 1668, alt: 'Các hình ảnh hoạt động an sinh, trao quà, chuẩn bị nhu yếu phẩm và sinh hoạt cộng đồng' },
    text: 'Đời sống cộng đồng được vun đắp từ nhiều sự góp sức. Người dành thời gian, người chung tay chuẩn bị, người trao gửi những vật phẩm thiết thực. Nhìn lại những hoạt động an sinh của khu phố mình, chúng ta thấy sự sẻ chia hiện diện trong nhiều việc làm hằng ngày.\nTừ việc chuẩn bị gạo và nhu yếu phẩm đến trao những phần quà trong buổi gặp gỡ, chúng ta cùng chăm lo cho nhau bằng những việc làm cụ thể. Những khung hình sinh hoạt đông vui cũng nhắc rằng sự gắn kết còn đến từ cơ hội cùng gặp mặt, trò chuyện và tham gia đời sống chung.\nChăm lo cộng đồng cần sự bền bỉ và phối hợp. Mỗi phần đóng góp, khi đến đúng nhu cầu, đều có thể trở thành một sự hỗ trợ có ý nghĩa. Tinh thần ấy được tiếp nối bằng việc cùng nhìn quanh, cùng lắng nghe và cùng làm những điều vừa sức.',
    takeaway: 'Sẻ chia phù hợp với khả năng, bắt đầu từ nhu cầu thực tế của người được hỗ trợ.',
  },
  {
    ...base, id: 'chung-tay-giu-goc-pho-xanh', category: 'Môi trường sống',
    title: 'Góc phố sạch hơn từ những bàn tay cùng góp',
    introduction: 'Giữ gìn môi trường sống bắt đầu ngay trên con đường quen thuộc, bằng sự chung tay của người dân và các đoàn thể.',
    localImage: { src: '/images/kp19/môi trường.jpg', width: 1200, height: 1509, alt: 'Cảnh quan tuyến đường và người dân, đoàn thể Khu phố 19 cùng dụng cụ dọn vệ sinh' },
    text: 'Con đường đi qua mỗi ngày là một phần không gian sống chung. Giữ cho nơi ấy sạch sẽ, gọn gàng cũng là cách quan tâm đến hàng xóm và những người cùng sử dụng tuyến đường. Qua những hoạt động môi trường của khu phố mình, chúng ta cùng nhắc nhau giữ gìn không gian chung.\nBà con và các đoàn thể cùng góp sức dọn vệ sinh, chăm chút cho tuyến đường quen thuộc. Cùng với việc làm sạch cảnh quan, chúng ta nhắc nhau phân loại rác tại nguồn và giữ thói quen xử lý rác đúng cách mỗi ngày.\nMột buổi chung tay cần được tiếp nối bằng những lựa chọn nhỏ: bỏ rác đúng chỗ, phân loại theo hướng dẫn tại địa phương và giữ sạch khu vực trước nhà. Khi mỗi người góp một phần, việc chăm sóc môi trường trở thành nếp sống chung của khu phố.',
    takeaway: 'Giữ sạch trước cửa nhà, bỏ rác đúng nơi và cùng nhắc nhau bằng sự tôn trọng.',
  },
  {
    ...base, id: 'nghia-tinh-tu-nhung-lan-co-mat', category: 'An sinh & nghĩa tình',
    title: 'Nghĩa tình bắt đầu từ những lần có mặt',
    introduction: 'Có mặt trong một buổi sinh hoạt, ngồi lại cùng bà con, góp vào niềm vui chung: sự gắn bó của khu phố mình được vun đắp từ những điều gần gũi ấy.',
    localImage: { src: '/images/kp19/an sinh nghĩa tình.jpg', width: 1280, height: 960, alt: 'Bà con Khu phố 19 cùng tham gia sinh hoạt cộng đồng với những cánh tay giơ cao' },
    text: 'Nhìn những cánh tay cùng giơ cao trong buổi sinh hoạt của khu phố mình, chúng ta thấy niềm vui của việc được gặp nhau và cùng tham gia. Giữa những người hàng xóm quen mặt, một lần có mặt cũng là một lần góp vào sự gắn kết chung.\nChăm lo đời sống bắt đầu từ những điều thiết thực, nhưng cũng cần cả sự gần gũi. Bên cạnh những phần quà và nhu yếu phẩm, chúng ta dành cho nhau thời gian, sự lắng nghe và cơ hội cùng góp tiếng nói. Qua những lần gặp gỡ, mỗi người có thêm dịp hiểu bà con quanh mình, để sự quan tâm được tiếp nối trong đời sống hằng ngày.\nKhu phố mình ấm áp hơn khi mỗi người thấy mình là một phần của cộng đồng. Chúng ta có thể bắt đầu bằng việc tham gia một hoạt động vừa sức, hỏi thăm một người hàng xóm hoặc dành chút thời gian cho việc chung. Nghĩa tình được vun đắp như thế, qua những lần chúng ta chọn có mặt bên nhau.',
    takeaway: 'Dành thời gian cho một cuộc gặp gỡ ở khu phố mình; sự có mặt cũng là một cách sẻ chia.',
  },
  {
    ...base, id: 'trao-trang-sach-mo-uoc-mo', category: 'Văn hóa & học tập',
    title: 'Trao trang sách, mở thêm ước mơ',
    introduction: 'Từ những cuốn sách được trao tận tay, chúng ta cùng chăm chút cho niềm vui học tập và những bước trưởng thành của các em nhỏ trong khu phố.',
    localImage: { src: '/images/kp19/văn hóa học tập.jpg', width: 2560, height: 1920, alt: 'Các em học sinh cùng đoàn viên và bà con trong hoạt động trao tặng sách tại Khu phố 19' },
    text: 'Trong bức ảnh trao tặng sách của khu phố mình, các em đứng cạnh nhau, trên tay là những phần sách được chuẩn bị. Khoảnh khắc ấy nhắc chúng ta rằng việc chăm lo cho học tập có thể bắt đầu từ một điều rất cụ thể: giúp các em có thêm sách để đọc, để học và để khám phá.\nTrao một cuốn sách cũng là gửi gắm sự quan tâm đến con đường trưởng thành của các em. Chúng ta cùng góp sức để việc học có thêm sự đồng hành từ gia đình, đoàn viên và bà con. Mỗi trang sách mở ra một cơ hội tìm hiểu; mỗi lần người lớn quan tâm đến việc học là thêm một lời động viên để các em tiếp tục cố gắng.\nTừ hoạt động trao tặng sách, chúng ta có thể nối dài niềm vui ấy bằng những việc hằng ngày: giữ gìn sách để chuyền cho người cần, cùng các em đọc một đoạn ngắn, hoặc lắng nghe điều các em vừa học được. Khi việc đọc có người đồng hành, cuốn sách được trao sẽ có thêm cơ hội trở thành một phần trong hành trình lớn lên của các em.',
    takeaway: 'Chọn một cuốn sách còn tốt để sẻ chia, hoặc dành thời gian cùng một em nhỏ đọc và trò chuyện.',
  },
  {
    ...base, id: 'giu-mau-xanh-tu-nep-song-moi-ngay', category: 'Môi trường sống',
    title: 'Giữ màu xanh bằng nếp sống mỗi ngày',
    introduction: 'Sau những lần chung tay dọn vệ sinh, điều chúng ta cùng gìn giữ là một thói quen: quan tâm đến con đường, khoảng sân và không gian sống quanh mình.',
    localImage: { src: '/images/kp19/môi trường.jpg', width: 1200, height: 1509, alt: 'Tuyến đường và hoạt động chung tay vệ sinh môi trường của bà con, đoàn thể Khu phố 19' },
    text: 'Những dụng cụ dọn vệ sinh trong ảnh gợi nhắc một việc rất gần với mỗi người: chăm sóc nơi mình đang sống. Bà con và các đoàn thể cùng góp sức cho tuyến đường chung, để sự quan tâm đến môi trường được thể hiện bằng hành động cụ thể.\nSau một lần chung tay, chúng ta còn nhiều dịp để tiếp nối. Một túi rác được bỏ đúng nơi, phần rác được phân loại theo hướng dẫn hay khu vực trước nhà được giữ gọn đều góp vào cảnh quan chung. Những thói quen ấy cần sự đều đặn; mỗi người làm một chút để công sức của nhau được gìn giữ lâu hơn.\nSống cùng một khu phố, chúng ta cùng chia sẻ con đường và những khoảng không gian quen thuộc. Vì vậy, nhắc nhau giữ sạch cũng cần sự thân tình và tôn trọng. Bắt đầu từ phần việc của mình, cùng làm khi có thể và động viên nhau duy trì, chúng ta từng bước đưa việc bảo vệ môi trường vào nếp sống hằng ngày.',
    takeaway: 'Chọn một việc giữ vệ sinh mà mình có thể duy trì mỗi ngày, rồi rủ người thân cùng thực hiện.',
  },
  {
    ...base, id: 'bep-se-chia-am-tinh-hang-xom', category: 'Người tốt, việc tốt',
    title: 'Bếp sẻ chia, ấm tình hàng xóm',
    introduction: 'Bên chiếc bàn chuẩn bị những phần ăn, mỗi người góp một tay. Điều được trao đi còn là sự quan tâm của bà con dành cho nhau.',
    localImage: { src: '/images/kp19/người tốt việc tốt.jpg', width: 2560, height: 1920, alt: 'Đoàn viên và bà con Khu phố 19 cùng chia, đóng gói những phần ăn bên chiếc bàn chung' },
    text: 'Trong hình ảnh của khu phố mình, đoàn viên và bà con cùng đứng quanh chiếc bàn, chia và chuẩn bị những phần ăn. Mỗi người một thao tác, cùng góp vào một việc chung. Sự sẻ chia hiện lên qua những đôi tay đang làm việc, gần gũi như chính tình hàng xóm của chúng ta.\nĐể chuẩn bị những phần ăn, chúng ta góp thời gian và công sức theo khả năng của mình. Khi cùng làm, mỗi phần việc đều có ý nghĩa: từ chuẩn bị, chia phần đến sắp xếp gọn gàng. Sự phối hợp ấy khiến việc tốt trở thành cơ hội để các thế hệ gần nhau hơn và cùng chăm lo cho cộng đồng.\nNhìn lại khoảnh khắc này, chúng ta có thêm một cách bắt đầu: tìm một việc có ích và góp sức cùng nhau. Có người góp nguyên liệu, có người góp thời gian, có người giúp kết nối với nơi đang cần. Khi sự quan tâm được đặt vào từng phần việc, những phần ăn được chuẩn bị cũng mang theo tình cảm của khu phố mình.',
    takeaway: 'Góp một phần việc vừa sức vào hoạt động sẻ chia và cùng giữ sự chu đáo trong từng việc nhỏ.',
  },
]

export function mergeCommunityStories(records: EditorialRecord[]): CommunityStory[] {
  const ids = new Set(records.map(item => item.id))
  return [...COMMUNITY_STORIES.filter(item => !ids.has(item.id)), ...records]
}
